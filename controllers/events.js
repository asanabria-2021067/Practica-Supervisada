const { request, response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req = request, res = response) => {

    const eventos = await Evento.find()
        .populate('Usuario', 'name'); //populate traer toda la información del usuario

    res.json({
        ok: true,
        msg: eventos
    })

}


const crearEvento = async(req = request, res = response) => {
    const { notes , ...body } = req.body;
    try {
        //Mandamos el usuario que graba la nota
        const data = {
            ...body,
            title: body.title.toUpperCase(),
            user: req.uid
        }
        console.log('Data user: ', data.user)

        const evento = await Evento(data);
        console.log(evento);
        await evento.save(data);
        console.log('Despues de guardar')
        res.json({
            ok: true,
            evento
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
    }

}


const actualizarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por el id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            title: req.body.title.toUpperCase(),
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el admin'
        });
    }

}


const eliminarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por el id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);
        
        res.json({
            ok: true,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el admin'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
